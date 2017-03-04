module Main exposing (..)

import UI
import Html exposing (..)
import Html.Events exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { ui : UI.Model
    }



-- type alias Model =
--     { prop : String
--     }


init : ( Model, Cmd Msg )
init =
    ( Model UI.init, Cmd.none )



-- UPDATE


type Msg
    = UI UI.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UI subMsg ->
            let
                ( ui, uiCmds ) =
                    UI.update subMsg model.ui
            in
                ( { model | ui = ui }, Cmd.map UI uiCmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ Html.map UI (UI.view model.ui)
        ]
