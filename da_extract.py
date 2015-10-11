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
	parser = argparse.ArgumentParser(description='Process input (year)')
	parser.add_argument('year', type=int, nargs=1, help='year for which articles should be extracted')
	parseResult = parser.parse_args()
	year = parseResult.year[0]

	rootURL = "http://www.uexpress.com"

	# regular expression templates for matching question/response
	rxTo = re.compile('^DEAR ABBY')
	rxFrom = re.compile('^DEAR')

	r  = requests.get(rootURL + "/dearabby/archives/" + str(year))
	data = r.text
	soup = BeautifulSoup(data, "html.parser")

	for link in soup.find_all("a", class_="media-link-main"):
		r = requests.get(rootURL+link.get('href'))
		data = r.text
		s2 = BeautifulSoup(data, "html.parser")
		articles = s2.find_all("article", class_="item-section")
		# print link.get('href') + " | " + str(len(articles)) + " articles"
		for i in range(len(articles)):
			# get title
			titles = []
			if i == 0:
				# assumes there is only one "item-title" header per page,
				#   and that it corresponds to first article
				title = s2.find("h1",class_="item-title").get_text().strip()
			else:
				if not titles:
					titles = s2.find_all("h2",class_="item-section-title")
				title = titles[i-1].get_text().strip()
			# get article content
			paragraphs = articles[i].find_all("p")
			# initialize article deets
			question = []
			response = []
			article_part = 0 # 1: question; 2: response
			for ii in range(len(paragraphs)):
				txt = paragraphs[ii].get_text().strip()
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
					print "Error: no text matched."

			art = article(title,'\n'.join(question),'\n'.join(response))
			art.tags = [category.get_text().strip() for category in articles[i].find_all("a", class_="read-more-link")]

			print art

			# print str(len(paragraphs)) + " paragraphs"
			# print "FIRST:\n" + str(paragraphs[0].contents)

main()