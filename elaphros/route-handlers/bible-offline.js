module.exports = function ping(req, reply) {
  return reply.view('/ui/pages/bible/offline.marko', {})
}
