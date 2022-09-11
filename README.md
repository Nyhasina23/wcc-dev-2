# wcc_week2
# API DOCUMENTATION

## signup
If the user does not have an account he must create an account 
and at the same time add his first exchange
Only connected user can add exchanges and change his exchanges status 

**POST** `` http://66.94.126.40/user/signup``

### payloads (body)
- name : name of the user (string)
- contact : phone number (string)
- password : minimum 8 characters (string)
- toyName : name of the toy the user want to exchange (string)
- exchangeWith : name of the toy the user want to exchange his toy (string)
- images : pictures of the user toy (files)

### response

`` token `` this token is require when a user want to edit his exchanges status or when a user want to add another exchange


## signin
If the user already have an account he must signin to get his token
Only connected user can add exchanges and change his exchanges status 

**POST** `` http://66.94.126.40/user/signin``

### payloads (body)
- contact : phone number (string)
- password : minimum 8 characters (string)

### response

`` token `` this token is require when a user want to edit his exchanges status or when a user want to add another exchange

## Create exchange
If the user already have an account he must signin to get his token
Only connected user can add exchanges and change his exchanges status 

**POST** `` http://66.94.126.40/exchange/create``

### Authorization 
- Type : The token given on user signup or signin(Bearer Token) 

### payloads (body)
- name : name of the toy the user want to exchange (string)
- exchangeWith : name of the toy the user want to exchange his toy (string)
- images : pictures of the user toy (files)

## Deactivate exchange

**PUT** `` http://66.94.126.40/exchange/deactivate/?id=exchangeId``

### payloads (params)
- id : exchange identifiant

## Get active exchanges (paginated)

**GET** `` http://66.94.126.40/exchange/?page=pageNumber``

### payloads (params)
- page : page number (decimal)

