module Main exposing (..)

import Socket exposing (init, listen, Msg(..))
import UI
import Html exposing (..)
import WebSocket


type alias Flags =
    { jwt : String
    }


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { flags : Flags
    , ui : UI.Model
    }


model : Flags -> Model
model flags =
    { flags = flags
    , ui = UI.init
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( model flags, Cmd.none )



-- UPDATE


type Msg
    = UI UI.Msg
    | Message Socket.Receive


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UI subMsg ->
            let
                ( ui, uiCmds ) =
                    UI.update subMsg model.ui
            in
                ( { model | ui = ui }, Cmd.map UI uiCmds )

        Message value ->
            let
                log =
                    Debug.log "message" value
            in
                ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Socket.listen "ws://echo.websocket.org" Message



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ Html.map UI (UI.view model.ui)
        ]



-- endpoint : String -> String
-- endpoint token =
--     "ws://localhost:4000/socket/websocket?guardian_token=" ++ token
