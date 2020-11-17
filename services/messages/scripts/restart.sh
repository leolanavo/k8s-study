# Little hack to ensure the script works no matter where it is called
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Delete both deployment and service
kubectl delete deployment.apps/messagesapi service/messages-api

VERSION=$1
IMAGE="leolanavo/messages-api:$VERSION"
RX_IMAGE="leolanavo\/messages-api:$VERSION"

# Rebuild docker image
docker image build --tag $IMAGE $DIR/..

# Push docker image
docker push $IMAGE

# Replace image at deployment.yaml
sed -i '' -E 's/image: .+/image: '"$RX_IMAGE"'/g' $DIR/../k8s/deployment.yaml

# Recreate deployment
kubectl apply -f $DIR/../k8s/deployment.yaml

# Reccreate service
kubectl apply -f $DIR/../k8s/service.yaml
