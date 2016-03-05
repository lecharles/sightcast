class TokensController < ApplicationController
  def get_token
    #!/usr/bin/env ruby
    require "net/https"
    require "uri"
    require "json"

    uri = URI.parse("https://api.rtccloud.net/v2.0/provider/usertoken")

    client_id = ENV["client_identifier"]
    client_secret = ENV["client_secret"]

    uid = current_user.username
    domain = ""
    profile = "premium"

    net = Net::HTTP.new(uri.host, uri.port)
    net.use_ssl = true
    net.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(uri.request_uri)
    request.initialize_http_header({"Authorization" => "Apikey #{client_id}#{client_secret}"})
    request.set_form_data({"uid" => uid, "domain" => domain, "profile" => profile})

    response = net.request(request)

    if response.code == "201"
        body = response.read_body
        puts body
        render json: body
    end
  end
end
