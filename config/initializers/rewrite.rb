Rails.application.config.middleware.insert_before(Rack::Lock, Rack::Rewrite) do
  r301 '/bible/verse/$4/$1/$2/$3', '/bible/$1.$2.$3.$4'
  # rewrite '/wiki/John_Trupiano', '/john'
  # r301 '/wiki/Yair_Flicker', '/yair'
  # r302 '/wiki/Greg_Jastrab', '/greg'
  # r301 %r{/wiki/(\w+)_\w+}, '/$1'
end
