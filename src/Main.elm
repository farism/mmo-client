module Main exposing (..)

import Chat
import UI
import Phoenix exposing (..)
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
    , ui :
        UI.Model
        -- , socket : Phoenix.Socket
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( Model flags UI.init, Cmd.none )



-- UPDATE


type Msg
    = UI UI.Msg
    | Phoenix String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UI subMsg ->
            let
                ( ui, uiCmds ) =
                    UI.update subMsg model.ui
            in
                ( { model | ui = ui }, Cmd.map UI uiCmds )

        Phoenix subMsg ->
            (model |> Debug.log "phx") ! []



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen (endpoint model.flags.jwt) Phoenix



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ Html.map UI (UI.view model.ui)
        ]


endpoint : String -> String
endpoint jwt =
    "ws://localhost:4000/socket/websocket?guardian_token=" ++ jwt
