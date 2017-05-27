#! /bin/sh
set -eux

echo {\"build_parameters\": {\"COMPONENT\": \"web\", \"VERSION\": \"$CIRCLE_SHA1\"}} > post
curl -fv -u $CIRCLE_TOKEN: -d @post -H 'Content-Type: application/json' https://circleci.com/api/v1.1/project/github/phoebus-games/deploy/tree/master
