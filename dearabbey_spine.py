import re
articles = {}

articles[1] = {}
articles[1]["Topic"] = "Mental Health"
articles[1]["Heading"] = "Man's Anger Issues Threaten to Break Loving Relationship"
articles[1]["Prompt"] = "DEAR ABBY: I have anger issues and sometimes I take it out on the ones I love. When my fiancee recently told me we are having a child, I hoped my attitude would change. It hasn't, and at times it has gotten worse. I hit her last night and it left a mark. I feel awful for the pain I continue to cause her, and I keep telling myself this is the last time. I know she should drop me and be done with this abusive relationship, but she believes in me and holds onto the hope that better days are around the corner. I know the things I have done will never be forgotten. How can I fix this? Or is it too late and we are both lying to ourselves? -- ASHAMED IN ANAHEIM, CALIF."
articles[1]["Response"] = "DEAR ASHAMED: It isn't too late IF you are willing to seek professional help for your anger issues. Change isn't easy, but it is possible if you are willing to put in the effort and find ways of coping with your anger other than lashing out at those closest to you. Your physician should be able to refer you to a therapist who can help you. However, if that's not feasible, contact your county department of mental health about counseling. If you hit your pregnant girlfriend again, you could seriously injure her or your baby, so please don't wait to talk to someone. While I empathize with her loving and having faith in you, she must now put the child she is carrying first. If you assault her again, she should call the police. But I would rather you get help for your problem on your own than your having a criminal record and court-ordered anger management."

articles[2] = {}
articles[2]["Topic"] = "Money"
articles[2]["Heading"] = "Woman Pays for Spending Spree With Feelings of Guilt"
articles[2]["Prompt"] = "DEAR ABBY: I came into a large sum of money because of an accident a relative of mine was in about a year ago. I spent it on a variety of items for myself, my husband and my mother. I paid off some debt and medical bills, and we also made two significant purchases as well as many small ones. Seventy-five percent of the money has been spent. I am OK with that and so is my husband. My financial adviser, who has been managing two of the beneficiary accounts from the accident, has asked me about the other funds I received. I know to some people I was irresponsible and I should have saved as much as I could. I'm nervous about telling him what I chose to do. I'm afraid he'll judge me for not being more frugal with the money. Truth be told, it isn't his business how that money was spent because he wasn't managing it for me. How should I tell him about it? I feel like a typed letter is my best bet. -- NERVOUS IN KOKOMO, IND."
articles[2]["Response"] = "DEAR NERVOUS: I hope you realize that you are thinking like a guilty child and not the adult you are now. If you prefer to answer your money manager's question via a typed letter, that is your privilege. However, it would be quicker and faster if you stop worrying about his reaction, pick up the phone and talk to the man. I agree it's not his job to judge you, but he would not be acting in your best interest if he didn't advise you how to provide for your future with the monies you have left after the spending spree you have described. Be prepared for it, and please do not regard anything he says as criticism from a scolding parent, because he's not your father."

articles[3] = {}
articles[3]["Topic"] = "Teens"
articles[3]["Heading"] = "Teen Becomes Tongue-Tied When She Tries to Say Thanks"
articles[3]["Prompt"] = "DEAR ABBY: I'm a 17-year-old girl, and all my life I have had trouble accepting gifts, even inexpensive ones. I do believe it's the thought that counts, but I have trouble expressing gratitude. An example: My brother was disappointed by my reaction when he got me soap shaped like a rock last Christmas. My smile was forced. I feel anxious when I get presents, no matter what they are. I have started seeing someone, and I was planning to save up for a really nice present for him. But when he said he wanted to do the same, I felt uncomfortable. What's a great line I can use to express my gratitude -- I'm happy that you thought of me? -- SEARCHING FOR WORDS OUT WEST"
articles[3]["Response"] = "DEAR SEARCHING FOR WORDS: Always say thank you. After that, you might express that the item is 'beautiful' or that you like the style or the color. In a case like your brother's gift, you could have said, 'Wow! This gift rocks!'"

articles[4] = {}
articles[4]["Topic"] = "Etiquette"
articles[4]["Heading"] = "Friends Throw Water on Woman's Plan to Become a Plumber"
articles[4]["Prompt"] = "DEAR ABBY: I am 29, independent, single and have a steady job. I'm planning on going back to school to become a certified plumbing technician.Here's the catch: I'm a woman, and because I'm female, some people make comments like, 'You don't want to do that. It's working with other people's ----!' Yes, this is really because I'm female. I have tried explaining that plumbing doesn't just involve unclogging toilets and that I feel it's a good choice for me, but I still get these stupid comments. One woman in particular I work with won't stop trying to talk me out of it. I think it's my choice and she's being rude. Is there a polite way to convince her without being rude? -- MS. PLUMBER IN LANCASTER, PENN."
articles[4]["Response"] = "DEAR MS. PLUMBER: Try this: 'Plumbers make good money. Right now, I'm making 'this' much, but once I complete the course I'll be earning ( )' If that doesn't convince her, nothing will."

articles[5] = {}
articles[5]["Topic"] = "Marriage & Divorce"
articles[5]["Heading"] = "Man Insists on Having TV With His Dinner"
articles[5]["Prompt"] = "DEAR ABBY: Is there any hope for a man who refuses to turn off the TV during dinner? When I tell him dinner is on the table, he waits until it's cold and then continues to watch the program from the dinner table and ignore me. I have asked him to please turn off the TV during meals, but he won't. He gobbles his food and doesn't close his mouth. Food drops out of the side of his mouth, and it's disgusting to see. Have you any suggestions? -- OVER IT IN STOCKTON, CALIF."
articles[5]["Response"] = "DEAR OVER IT: Your husband's behavior is passive-aggressive, and I can't help but wonder what he's punishing you for. It's sad that he has such atrocious table manners and such little consideration for your feelings. I 'suggest' you stop trying to serve him a hot meal, let him get his own food from the kitchen and eat it in front of the television when he's hungry, while you eat separately -- preferably out with friends."

def search_articles(search_term):
	search_term = search_term.lower()
	for var in articles:
		if re.search(search_term,articles[var]["Heading"].lower()):
			return articles[var]["Response"]
		else:
			continue
	for var in articles:
		if re.search(search_term,articles[var]["Prompt"].lower()):
			return articles[var]["Response"]
		else:
			continue
	for var in articles:
		if re.search(search_term,articles[var]["Response"].lower()):
			return articles[var]["Response"]
		else:
			continue

	print 'No matches found'
