#!/usr/bin/env python
# encoding: utf-8

# python-test.py
# used to test heroku compatibility with python child process

from subprocess import call
import sys

def main():
	print "begin python test..."
	"""
	call(["pip", "install", "beautifulsoup4"])
	call(["pip", "install", "requests"])
	call(["pip", "install", "simplejson"])
	"""
	print "Binary location is: " + str(sys.executable)
	print "fin test"

main()