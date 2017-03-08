module Socket exposing (init, listen, Msg(Receive))

import WebSocket


-- MODEL


type alias Model =
    { endpoint : String
    }


init : String -> Model
init endpoint =
    { endpoint = endpoint
    }



-- UPDATE


type Msg
    = Send String
    | Receive String


listen : String -> Sub Msg
listen endpoint =
    WebSocket.listen endpoint Receive
