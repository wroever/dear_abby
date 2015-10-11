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

	def __str__(self):
		result = "TITLE: " + self.title
		result += "\nQUESTION TEXT:\n" + self.question
		result += "\nRESPONSE TEXT:\n" + self.response
		if not self.tags:
			result += "\nTAGS: " + ', '.join(self.tags) + "\n"
		return result