module UI exposing (..)

import Chat
import Html exposing (..)
import Html.Events exposing (..)


-- MODEL


type alias Model =
    { chat : Chat.Model }


init : Model
init =
    Model Chat.init



-- UPDATE


type Msg
    = Chat Chat.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Chat subMsg ->
            let
                ( chat, chatCmds ) =
                    Chat.update subMsg model.chat
            in
                ( { model | chat = chat }, Cmd.map Chat chatCmds )



-- VIEW


view : Model -> Html Msg
view model =
    div [] [ Html.map Chat (Chat.view model.chat) ]
