module Phoenix.Socket exposing (..)

import Phoenix.Channel exposing (..)
import WebSocket
import Dict exposing (..)
import Json.Encode as JE exposing (..)
import Json.Decode as JD exposing (..)


type SocketStates
    = Connecting
    | Open
    | Closing
    | Closed


type ChannelStates
    = ChannelClosed
    | Errored
    | Joined
    | Joining
    | Leaving


type ChannelEvents
    = Close
    | Error
    | Join
    | Reply
    | Leave


type alias Socket msg =
    { endpoint : String
    , channels : Dict String (Channel msg)
    , params : Maybe JE.Value
    , encoder :
        JE.Value -> String
        -- , decoder : String -> JE.Value
    }


type Msg
    = Foo String


defaultSocketOptions : Socket msg
defaultSocketOptions =
    { endpoint = "ws://localhost:4000/socket/websocket"
    , channels = Dict.empty
    , params = Nothing
    , encoder =
        encoder
        -- , decoder = decoder
    }


init : String -> Socket msg
init endpoint =
    { defaultSocketOptions | endpoint = endpoint }


listen : Socket msg -> (String -> Msg) -> Sub msg
listen socket msg =
    WebSocket.listen socket.endpoint msg


encoder : JE.Value -> String
encoder value =
    JE.encode 0 value



-- decoder : String -> JE.Value
-- decoder value =
--     JD.decodeString value
