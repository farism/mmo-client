module Chat exposing (Model, Msg, init, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json


-- MODE


type alias Model =
    { messages : List Message
    , field : String
    }


type alias Message =
    { event : String
    , payload : String
    }


init : List Message -> Model
init messages =
    Model messages ""



-- UPDATE


type Msg
    = UpdateField String
    | Send


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateField str ->
            { model | field = str }

        Send ->
            { model | field = "" }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ input
            [ value model.field
            , onInput UpdateField
            , onEnter Send
            ]
            []
        ]


onEnter : Msg -> Attribute Msg
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                Json.succeed msg
            else
                Json.fail "not ENTER"
    in
        on "keydown" (Json.andThen isEnter keyCode)
