# https://moments.youversionapistaging.com/3.1/trending.json

class Trending < YV::Resource

  attributes [:verse]
  api_response_mapper YV::API::Mapper::Trending

  class << self

    # {
    #     "response": {
    #     "buildtime": "2015-03-04T18:34:33.327275+00:00",
    #     "code": 200,
    #     "data": [
    #     "GEN.1.1",
    #     "GEN.2.1",
    #     "GEN.3.1",
    #     "GEN.4.1",
    #     "GEN.5.1",
    #     "GEN.6.1",
    #     "GEN.7.1",
    #     "GEN.8.1",
    #     "GEN.9.1",
    #     "GEN.10.1",
    #     "GEN.11.1",
    #     "GEN.12.1",
    #     "GEN.13.1",
    #     "GEN.14.1",
    #     "GEN.15.1",
    #     "GEN.16.1",
    #     "GEN.17.1",
    #     "GEN.18.1",
    #     "GEN.19.1",
    #     "GEN.20.1",
    #     "GEN.21.1",
    #     "GEN.22.1",
    #     "GEN.23.1",
    #     "GEN.24.1",
    #     "GEN.25.1",
    #     "GEN.26.1",
    #     "GEN.27.1",
    #     "GEN.28.1",
    #     "GEN.29.1",
    #     "GEN.30.1"
    # ]
    # }
    # }

    def list_path
      "moments/trending"
    end

  end
end
