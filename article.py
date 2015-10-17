#!/usr/bin/env python
# encoding: utf-8

# article.py
# Dear Abby article class declaration

# A class representing an individual Dear Abby article
class article(object):

	def __init__(self, title=None, question=None, response=None, date=None):
		self.title = title
		self.question = question
		self.response = response
		self.tags = []

	# for logging/debugging
	def __str__(self):
		result = "TITLE: " + self.title
		result += "\nQUESTION TEXT:\n" + self.question
		result += "\nRESPONSE TEXT:\n" + self.response
		if not self.tags:
			result += "\nTAGS: " + ', '.join(self.tags) + "\n"
		return result

	# determines if an article is "incomplete," that is, if it does not include
	#   a question and a response (note that a title is optional)
	def isIncomplete(self):
		result = False
		for i in [self.question, self.response]:
			if i is None:
				result = True
		return result

	def jsonify(self):
		result = '{ "title": "'
		if self.title:
			result += json_encode(self.title)
		result += '", "submission": "' + json_encode(self.question) + '", '
		result += '"response": "' + json_encode(self.response) + '", '
		if self.tags:
			result += '"tags": ["' + '", "'.join([json_encode(item) for item in self.tags]) + '"]'
		else:
			result += '"tags": []'
		result += " }"
		return result

def json_encode(s):
	return s.replace('"','\\"').replace('\n','\\n').encode('ascii','ignore')