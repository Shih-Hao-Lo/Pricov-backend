from selenium import webdriver
import codecs
import sys 
import time


print('in py!')

url='https://www.target.com/s?searchTerm=apple+laptop'
#url='https://www.amazon.com/s?k='+'apple'+'+'+'phone'

#open the browser and visit the url
driver = webdriver.Chrome('./chromedriver')
driver.get(url)

time.sleep(5)
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

xpath= 'div[@data-test=product-card-default]'
data = driver.find_elements_by_tag_name('ul')
print(data)
print(str(len(data)))
fw=codecs.open('target.txt','w',encoding='utf8')
arr = []
for single in data:
    lidata = single.find_elements_by_tag_name('li')
    if len(lidata)==26:
        arr = lidata
        break;

for item in arr:
    title='NA'
    url='NA'
    
    try:
        target = item.find_element_by_css_selector("[class=h-display-flex]")
        title = target.text
        url = target.find_element_by_tag_name("a").get_attribute('href')
        print(title)
        print(url)
    except:
        title = 'NA'
        print('No Title')
    
    

fw.close()
#driver.quit()