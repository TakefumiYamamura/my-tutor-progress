from selenium import webdriver
import chromedriver_binary
import time
import csv
import pprint
import re
import json
import os
import datetime

def parse_date_str(date_str):
	strs = re.findall(r'\d+', date_str)
	return strs[0] + "," + strs[1] + "," + strs[2] + "\n"

def parse_date_str_to_epoch_time(date_str):
	strs = re.findall(r'\d+', date_str)
	return int(datetime.datetime(int(strs[0]), int(strs[1]), int(strs[2])).timestamp())

login_url = "https://mypage.mytutor-jpn.com/login.do"
lesson_record_url = "https://mypage.mytutor-jpn.com/lessonrecord.do"

driver = webdriver.Chrome()
driver.get(login_url)
xpath_mail = "//html//body//div//div//form//table//tbody//tr[1]//td[2]//input"
xpath_password = "//html//body//div//div//form//table//tbody//tr[2]//td[2]//input"
xpath_submit = "//html//body//div//div//form//table//tbody//tr[3]//td//input"
mail = driver.find_element_by_xpath(xpath_mail)
mail.send_keys(os.environ.get('MYTUTOR_EMAIL'))
password = driver.find_element_by_xpath(xpath_password)
password.send_keys(os.environ.get('MYTUTOR_PASS'))

time.sleep(1)

login_button = driver.find_element_by_xpath(xpath_submit)
login_button.click()


date_strs = []
unix_time_json = {}

next_url = lesson_record_url
found_flag = True
while found_flag:
	driver.get(next_url)
	dates = driver.find_elements_by_xpath("/html/body/div/div[3]/div[1]/table/tbody/tr")
	for i in range(len(dates)):
		if(i == 0):
			continue
		try:
			print(dates[i].find_element_by_xpath("td[1]").text)
			date_strs.append(dates[i].find_element_by_xpath("td[1]").text)
		except:
			print("could not found")
	all_links = driver.find_elements_by_xpath("/html/body/div/div[3]/div[1]/div[1]/a")
	found_flag = False
	for link in all_links:
		if(link.text=="Next"):
			print("found next")
			found_flag = True
			print(link.get_attribute("href"))
			next_url = link.get_attribute("href")

driver.close()
epoch_time_records = {}
out_filename= os.path.dirname(os.path.abspath(__file__)) + "/../../resources/scraping_results/class_records.csv"
with open(out_filename, 'w') as out_file:
	for date_str in date_strs :
		key = parse_date_str_to_epoch_time(date_str)
		epoch_time_records[key] = epoch_time_records.get(key, 0) + 1
		out_file.write(parse_date_str(date_str))

out_filename= os.path.dirname(os.path.abspath(__file__)) + "/../../resources/scraping_results/epoch_time_records.json"
with open(out_filename, 'w') as out_file:
	out_file.write(json.dumps(epoch_time_records, indent = 4))
