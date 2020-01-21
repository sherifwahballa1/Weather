# Weather
Weather temperature

to use this app you should register at the beginning 
in register process
you must enter name with length more than or equal 4 characters
you must enter valid email
password must be more than 8 characters and confirm password should be the same as password
after the registeration 
the register process or login redirect to home page
at home page you can entery any country you want to know it's temperature degree
if country not exists or name not valid it will print error message
else
it will print the name of the country and the temperature and favourite button if user like to put this country in his favs
and all countries that user fav will show in a table will user login to home page
data in mongodb updated every 24 hour
i used two function to do this 
first way i will check if pass 24 hour to update all data in mongodb
the second way i used the node cron package to update data every 24 hour
i used host database in monogdb atlas 
