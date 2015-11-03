#!/usr/bin/env python
# encoding: utf-8

# da_extract.py
# script to extract all articles from a given year from the dear abby site
#
# usage: python da_extract.py [year]
# creates article objects for all articles in the given year

import argparse, requests, re
from bs4 import *
from article import *

def main():
	
	# parse arguments (year)
	# parser = argparse.ArgumentParser(description='Process input (year)')
	# parser.add_argument('year', type=int, nargs=1, help='year for which articles should be extracted')
	# parseResult = parser.parse_args()
	# year = parseResult.year[0]
	year = 2015

	rootURL = "http://www.uexpress.com"

	# regular expression templates for matching question/response
	rxTo_HTML = re.compile('<p>DEAR ABBY:')
	rxTo = re.compile('^DEAR ABBY:')
	rxFrom = re.compile('^DEAR')

	insertID = 1

	while year > 1990:
		r  = requests.get(rootURL + "/dearabby/archives/" + str(year))
		r_text = r.text
		soup = BeautifulSoup(r_text, "html.parser")

		# iterate over all links for the current year
		for link in soup.find_all("a", class_="media-link-main"):
			r = requests.get(rootURL+link.get('href'), timeout=60)
			r_text = r.text
			s2 = BeautifulSoup(r_text, "html.parser")
			page_articles = s2.find_all("article", class_="item-section") # gives articles INCLUSIVE of non-Q&A-style ones

			# print link.get('href') + " | " + str(len(page_articles)) + " articles"

			page_da_count = 0
			titles = []

			for a in page_articles:
				# need to count (and eventually insert into the DB...) only Q&A-style articles
				if re.search(rxTo_HTML, str(a)):
					page_da_count += 1

					# get title
					if page_da_count == 1:
						# assumes there is only one "item-title" header per page,
						#   and that it corresponds to first article
						title = s2.find("h1",class_="item-title").get_text().strip()
					else:
						# get list of titles if none exists
						if not titles:
							titles = s2.find_all("h2",class_="item-section-title")
						# if titles found, store the appropriate title in the list, else use empty string
						if len(titles) > 0:
							title = titles[page_da_count-2].get_text().strip()
						else:
							title = ""

					# get article content
					paragraphs = a.find_all("p")

					# initialize and get article deets
					question = []
					response = []
					article_part = 0 # 1: question; 2: response
					for i in range(len(paragraphs)):
						txt = paragraphs[i].get_text().strip()
						if re.search(rxFrom,txt):
							if re.search(rxTo,txt):
								article_part = 1
							else:
								article_part = 2
						if article_part == 1:
							question.append(txt)
						elif article_part == 2:
							response.append(txt)
						else:
							# ignore questionless article types, these seem to usually be holiday greetings
							print "Error: no text matched: " + link.get("href")

					# if a complete article is identified, create article opject and insert it
					if article_part == 2:
						art = article(title,'\n'.join(question),'\n'.join(response))
						art.tags = [category.get_text().strip() for category in a.find_all("a", class_="read-more-link")]

						# insert article if determined to be complete, else log it w/ print
						if art.isIncomplete():
							print "Error: failed to insert:" + str(art)
						else:
							put_target = "http://paas:9976e98d4aa969846497a583e29a0651@fili-us-east-1.searchly.com/articles/article/" + str(insertID)
							#print art.jsonify()
							db_put_result = requests.put(put_target, data=art.jsonify())			
							print db_put_result.status_code
							print db_put_result.content
							insertID += 1

		print "FIN! Year: " + str(year)
		year -= 1

			# print str(len(paragraphs)) + " paragraphs"
			# print "FIRST:\n" + str(paragraphs[0].contents)

main()