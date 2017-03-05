module Phoenix exposing (..)

import Dict exposing (..)


type alias Socket =
    { url : String
    , channels : Dict String Channel
    }


type alias Channel =
    { name : String
    }
