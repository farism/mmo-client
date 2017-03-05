module Chat exposing (Model, Msg, init, update, view)

import Html exposing (..)
import Html.Attributes exposing (value)
import Html.Events exposing (..)
import Json.Decode as Json
import WebSocket


-- MODE


type alias Model =
    { messages : List Message
    , field : String
    }


type alias Message =
    { event : String
    , payload : String
    }


init : Model
init =
    Model [] ""



-- UPDATE


type Msg
    = UpdateField String
    | Send String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateField input ->
            { model | field = input } ! []

        Send input ->
            { model | field = "" } ! []



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ form [ onSubmit (Send model.field) ]
            [ input
                [ value model.field
                , onInput UpdateField
                ]
                []
            ]
        ]
