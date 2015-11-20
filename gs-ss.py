#!/usr/bin/env python
# encoding: utf-8

# gs-ss.py
# pulls Dear Harriette search results, using google advanced search API

import argparse, re, requests, urllib, urllib2, simplejson, HTMLParser
from bs4 import *
from article import *

# URL -> Boolean
# determines whether the given URL corresponds to a Dear Harriette article page
def is_article(url):
	rX1 = re.compile(r'uexpress.com/sense-and-sensitivity/')
	rX2 = re.compile(r'/topics/')
	if re.search(rX1,url) and not re.search(rX2,url):
			return True
	return False

# Parser String -> String
# cleans up google search api result so that it can be used in identifying the full article
def get_content_str(parser,content_str):
	rX_tags = re.compile(r'<[^>]+>')
	rX_unicode = re.compile(r'[^\x00-\x7F\n]+')
	rX_match = re.compile(r'([\.\s]+)?([^\.]+)')
	content_str = re.sub(rX_tags,'',parser.unescape(content_str.replace('\n','')))
	content_str = re.sub(rX_unicode,'',content_str)
	match_result = re.search(rX_match,content_str[13:])
	if match_result:
		return match_result.group(2).strip()
	else:
		return None

# URL String -> Article
# pulls article containing the given text from the URL
def get_article(url,txt):
	rX_to = re.compile('^DEAR HARRIETTE:')
	rX_from = re.compile('^DEAR')
	rX_excerpt = re.compile(txt)

	# get/parse page contents
	r = requests.get(url)
	r_text = r.text
	soup = BeautifulSoup(r_text, "html.parser")

	# get articles
	page_articles = soup.find_all("article", class_="item-section")

	# search articles for excerpt
	for a in page_articles:
		if re.search(rX_excerpt, str(a)):
			# get article content
			paragraphs = a.find_all("p")
			question = []
			response = []
			article_part = 0 # 1: question; 2: response
			for p in paragraphs:
				txt = p.get_text().strip()
				if re.search(rX_from,txt):
					if re.search(rX_to,txt):
						article_part = 1
					else:
						article_part = 2
				if article_part == 1:
					question.append(txt)
				elif article_part == 2:
					response.append(txt)
				else:
					print "Error: no text matched."

			# if a complete article is identified, create article opject and insert it
			if article_part == 2:
				art = article(None,'\n'.join(question),'\n'.join(response))
				art.tags = [category.get_text().strip() for category in a.find_all("a", class_="read-more-link")]
				return art

	return False

# Query -> JSON dump
def main():
	
	# parse arguments (year)
	parser = argparse.ArgumentParser(description='Query Google')
	parser.add_argument('--query', help='add query string', required=True)
	args = parser.parse_args()

	q = args.query.encode('utf8')
	query_params = {'userip': 'USERS-IP-ADDRESS',
					'q': q,
					'as_q': q,
					'as_qdr': 'all',
					'as_sitesearch': 'uexpress.com/sense-and-sensitivity',
					'as_occt': 'any',
					'v': '1.0'}
	# print urllib.urlencode(query_params)

	# The request also includes the userip parameter which provides the end
	# user's IP address. Doing so will help distinguish this legitimate
	# server-side traffic from traffic which doesn't come from an end-user.
	url = ('https://ajax.googleapis.com/ajax/services/search/web?'+urllib.urlencode(query_params))

	request = urllib2.Request(url, None)
	response = urllib2.urlopen(request)

	# Process the JSON string
	results = simplejson.load(response) # raw search result JSON obj
	#print simplejson.dumps(results, sort_keys=True, indent=(4 * ' '))
	
	results = results['responseData']['results']
	if not results:
		query_params = {'userip': 'USERS-IP-ADDRESS',
						'q': q.strip().replace(' ',' OR '),
						'as_oq': q,
						'as_qdr': 'all',
						'as_sitesearch': 'uexpress.com/sense-and-sensitivity',
						'as_occt': 'any',
						'v': '1.0'}
		# print urllib.urlencode(query_params)
		url = ('https://ajax.googleapis.com/ajax/services/search/web?'+urllib.urlencode(query_params))

		request = urllib2.Request(url, None)
		response = urllib2.urlopen(request)

		# Process the JSON string
		results = simplejson.load(response) # raw search result JSON obj
		#print simplejson.dumps(results, sort_keys=True, indent=(4 * ' '))
		
		results = results['responseData']['results']

	h = HTMLParser.HTMLParser()

	result = '{ "hits": ['
	result_article_count = 0

	for i in range(len(results)):
		#if is_article(results[i]['url']): indent below loop content when this line uncommented
		excerpt = get_content_str(h,results[i]['content'])
		if excerpt:
			article = get_article(results[i]['url'],excerpt)
			if article:
				if result_article_count != 0:
					result += ", "
				result += '{ "_source": ' + article.jsonify() + ', "img_type": "dear_harriette"}'
				result_article_count += 1

	# debugging...
	"""
	if result_article_count == 0:
		result += '"'+q+'"'
	"""

	result += '] }'
	print result

main()