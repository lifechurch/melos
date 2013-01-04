object false

node :by_language do |m|
  @versions_by_lang.map do |lang, versions|
    {
      name: versions.first.language.human,
      versions: versions.map {|v| partial("versions/show", :object => v)}
    }
  end
end