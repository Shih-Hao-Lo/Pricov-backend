#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Oct 15 00:15:22 2019

@author: wesley
"""
from selenium import webdriver
from bs4 import BeautifulSoup
import re
import time
import requests
import codecs
import pymongo

url='https://www.bestbuy.com/site/searchpage.jsp?st='
key='cellphone'
driver = webdriver.Chrome('./chromedriver')
driver.get(url+key)

pageNum=1 # number of pages to collect

fw=codecs.open('bestbuy.txt','w',encoding='utf8')
itemList = []

for p in range(1,pageNum+1): # for each page 
    
    print ('page',p)
    html=None

    if p==1: 
        pageLink=url+key # url for page 1
        print('pageLink,', pageLink)
    else: pageLink=url+'cp='+str(p)+'st='+key # make the page url
		
    items=driver.find_elements_by_css_selector("[class=sku-item]")
  
    for item in items:
     
        name, image, price, sale, link ='NA', 'NA', '', 'NA', 'NA' # initialize critic and text 
        
        try:          
            nameChunk=item.find_element_by_css_selector("[class*=sku-title]")
            if nameChunk: 
                name=nameChunk.text.strip()#.encode('ascii','ignore')
                url = nameChunk.find_element_by_tag_name("a").get_attribute('href')
                
             
        except:
            print ('no name')
            
        try:          
            imageChunk=item.find_element_by_tag_name("img")
            if imageChunk: 
                image=imageChunk.get_attribute('src')#.encode('ascii','ignore')   
        except:
            print ('no image')
        
        try:          
            priceChunk=item.find_element_by_css_selector("[class$=priceView-customer-price]").text
            if priceChunk: 
                for char in priceChunk:
                    if char == '\n': break;
                    price+=char
                #price=priceChunk.strip().replace('\n','')#.encode('ascii','ignore')   
            price = price.replace('$','')
        except:
            print ('no price')
        try:          
            sale=item.find_element_by_css_selector("[class=pricing-price__regular-price]").text
            sale = sale.replace('Was $','')
        except:
            print('no sale')
        itemList.append({'name':name, 'price':price, 'image': image})   
        print(name + '\t' + sale+ '\t' + price + '\t' + str(url) + '\t' + image + '\n')
        if sale == 'NA':
            fw.write(name + '\t' + price+ '\t' + sale + '\t' + url + '\t' + image + '\n') # write to file 
        else:
            fw.write(name + '\t' + sale+ '\t' + price + '\t' + url + '\t' + image + '\n') 
		
    

fw.close()
#driver.quit()

#myclient = pymongo.MongoClient("mongodb://localhost:27017/")
#dblist = myclient.list_database_names()
#if "bia660" in dblist:
#    print("The database exists.")
#    collist = mydb.list_collection_names()
#    if "cellphone" in collist:
#        print("The collection exists.")
#else:
#    print("The database does not exist")
#    mydb = myclient["bia660"]
#    mycol = mydb["cellphone"]
    
#    x = mycol.insert_many(itemList)

