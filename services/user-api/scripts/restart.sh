# Little hack to ensure the script works no matter where it is called
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Delete both deployment and service
kubectl delete deployment.apps/usersapi service/users-api-service

IMAGE="leolanavo/users-api:0.2.0"

# Rebuild docker image
docker image build --tag $IMAGE $DIR/..

# Push docker image
docker push $IMAGE

# Recreate deployment
kubectl apply -f $DIR/../k8s/deployment.yaml

# Reccreate service
kubectl apply -f $DIR/../k8s/service.yaml
