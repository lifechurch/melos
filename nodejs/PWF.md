# Plans with Friends

## Task Breakdown

- ### **Pre-work**

###### New Routes
- unique route for pwf plans (like our approach with unsubbed vs subbed plan view)
- redesign of action creators and reducers




- ### **Version I**

###### Lock plans to calendar day
- what does this mean exactly? besides limiting activity after the group has gone through the plan?

??
- disable plan actions on days before the current day from the API (and also days in the future?)
- still navigate and show everything, but just don't allow checkoffs?


###### Talk it over/Activity feed
- this plan route will bring you here after day refs are complete, before day complete view
- moments call for specific plan day to display already created comments from other friends
- moments create for posting your own comment
- ability to like and reply to others' comments
- ui




###### Invite
- select start date
- Max number of participants of a plan = 150
- list all yv friends
- search all yv friends
- search all yv users
- shareable link
- preview invitation
- edit invitation
- invitation
- ui
- plan action buttons for new flow


###### Generic Home feed moment
- once home feed is in react, this should be pretty trivial

###### Notifications
- add to settings view (or different plans with friends settings view?)



## Component Breakdown

start plan w/ friends

- new plan action buttons
- Invite
	- date select
		- reuse calendar
		- new day component with function callback on day click
	- friends
		- list selector
		- friend list
			- friend list item
			- select or remove
		- shareable link
		- search bar
		- selected
			- invitation buttons 
