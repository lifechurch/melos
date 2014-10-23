json.kind moment.kind
json.object do
  json.set! :moment_title, moment.moment_title
  json.set! :avatar, moment.avatars.lg_avatar.url if moment.avatars.present?
  json.set! :avatar_style, moment.avatars.style if moment.avatars.present?
  json.set! :category, moment.category
  unless moment.body_images.nil?
    json.body_image   moment.body_images.lg.url
  end
  json.plans moment.plans do |plan|
    json.id plan.id
    json.slug plan.slug
    json.name plan.name
    json.path plan_path("#{plan.id}-#{plan.slug}")
    json.formatted_length
    json.image_url plan.images.select{|i| i.height == 180}.first.url if plan.images.present?
  end
end