module Main exposing (..)

import Phoenix
import UI
import Html exposing (..)
import Html.Events exposing (..)
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



-- type alias Model =
--     { prop : String
--     }


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
            model ! []



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        endpoint =
            "ws://localhost:4000/socket/websocket?guardian_token=" ++ model.flags.jwt
    in
        WebSocket.listen endpoint Phoenix



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ Html.map UI (UI.view model.ui)
        ]
