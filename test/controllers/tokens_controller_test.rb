require 'test_helper'

class TokensControllerTest < ActionController::TestCase
  test "should get get_token" do
    get :get_token
    assert_response :success
  end

end
