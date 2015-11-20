#!/usr/bin/env python
# encoding: utf-8

# gs-ds.py : search Dan Savage's Savage Love column

import argparse, re, requests, urllib, urllib2, simplejson, HTMLParser
from bs4 import *
from article import *

# URL -> Boolean
# determines whether the given URL corresponds to a Dear Abby article page
def is_article(url):
	return True

# Parser String -> String
# cleans up google search api result so that it can be used in identifying the full article
def get_content_str(parser,content_str):
	rX_tags = re.compile(r'<[^>]+>')
	rX_unicode = re.compile(r'[^\x00-\x7F\n]+')
	rX_toMatch = re.compile(r'[0-9]+ (\.\.\.)?([^\.]+)')
	content_str = re.sub(rX_tags,'',parser.unescape(content_str.replace('\n','')))
	content_str = re.sub(rX_unicode,'',content_str)
	match_result = re.search(rX_toMatch,content_str)
	return match_result.group(2).strip()

# URL String -> Article
# pulls article containing the given text from the URL
def get_article(url):
	# get/parse page contents
	r = requests.get(url)
	r_text = r.text
	soup = BeautifulSoup(r_text, "html.parser")

	# get articles
	page_articles = soup.find_all("div", class_="article-text category-slog")

	# search articles for excerpt
	for a in page_articles:
		# get article content
		ps_and_as = a.find_all(["p","a"])
		question = []
		response = []
		article_part = 1 # 1: question; 2: response
		for pa in ps_and_as:
			if pa.has_attr('name') and pa['name'] == "more":
				article_part = 2
			else:
				if pa.name == "p":
					if article_part == 1:
						question.append(pa.get_text())
					elif article_part == 2:
						response.append(pa.get_text())

		# if a complete article is identified, create article opject and insert it
		if article_part == 2:
			art = article(None,'\n'.join(question),'\n'.join(response))
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
					'as_sitesearch': 'thestranger.com/blogs/slog/',
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
	# print simplejson.dumps(results, sort_keys=True, indent=(4 * ' '))
	
	results = results['responseData']['results']
	h = HTMLParser.HTMLParser()

	result = '{ "hits": ['
	result_article_count = 0

	for i in range(len(results)):
		#if is_article(results[i]['url']): indent below loop content when this line uncommented
		article = get_article(results[i]['url'])
		if article:
			if result_article_count != 0:
				result += ", "
			result += '{ "_source": ' + article.jsonify() + ', "img_type": "dan_savage"}'
			result_article_count += 1

	# debugging...
	"""
	if result_article_count == 0:
		result += '"'+q+'"'
	"""

	result += '] }'
	print result

main()