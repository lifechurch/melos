json.error do
  json.status 500
  json.error 'Unknown Error'
  json.message t('.explanation')
  json.action t('.our action')
end