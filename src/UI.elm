module UI exposing (..)

import Chat
import Html exposing (..)
import Html.Events exposing (..)


-- MODEL


type alias Model =
    { chat : Chat.Model }


model : Model
model =
    Model (Chat.init [])



-- UPDATE


type Msg
    = Chat Chat.Msg


update : Msg -> Model -> Model
update msg model =
    case msg of
        Chat subMsg ->
            { model | chat = Chat.update subMsg model.chat }



-- VIEW


view : Model -> Html Msg
view model =
    div [] [ Html.map Chat (Chat.view model.chat) ]
