module Main exposing (..)

import UI
import Phoenix.Socket as Socket exposing (..)
import Html exposing (..)


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
    , socket : Socket Msg
    , ui : UI.Model
    }


model : Flags -> Model
model flags =
    { flags = flags
    , socket = Socket.init (endpoint flags.jwt)
    , ui = UI.init
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( model flags, Cmd.none )



-- UPDATE


type Msg
    = UI UI.Msg
    | Phoenix (Socket.Msg Msg)


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
    Socket.listen model.socket Phoenix



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ Html.map UI (UI.view model.ui)
        ]


endpoint : String -> String
endpoint token =
    "ws://localhost:4000/socket/websocket?guardian_token=" ++ token
