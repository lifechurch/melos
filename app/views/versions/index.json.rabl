object false
cache "json-versions-bylang-rabl#{params[:context_version]}", expires_in: YV::Caching.a_long_time

node :by_language do |m|
  @versions_by_lang.map do |lang, versions|
    {
      name: versions.first.attributes.language.name,
      local_name: versions.first.attributes.language.local_name,
      versions: versions.map {|v| partial("versions/show", :object => v)}
    }
  end
end