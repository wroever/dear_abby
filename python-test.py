#!/usr/bin/env python
# encoding: utf-8

# python-test.py
# used to test heroku compatibility with python child process

from subprocess import call

def main():
	call(["pip", "install", "beautifulsoup4"])
	call(["pip", "install", "requests"])
	call(["pip", "install", "simplejson"])

main()