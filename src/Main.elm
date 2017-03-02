module Main exposing (..)

import UI
import Html exposing (..)
import Html.Events exposing (..)
import Debug exposing (..)
import List exposing (length)


main =
    Html.beginnerProgram
        { model = model
        , view = view
        , update = update
        }



-- MODE


type alias Model =
    { ui : UI.Model }


model : Model
model =
    { ui = UI.model }



-- UPDATE


type Msg
    = UI UI.Msg


update : Msg -> Model -> Model
update msg model =
    case msg of
        UI subMsg ->
            { model | ui = UI.update subMsg model.ui }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ Html.map UI (UI.view model.ui)
        ]
