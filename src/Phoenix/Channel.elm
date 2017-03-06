module Phoenix.Channel exposing (..)


type alias Channel msg =
    { name : String
    , on : String -> msg
    }
