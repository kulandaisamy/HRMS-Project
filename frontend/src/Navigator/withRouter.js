import { useNavigate, useParams, useLocation } from "react-router-dom";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();

    return (
      <Component
        {...props}
        params={params}
        navigate={navigate}
        location={location}
      />
    );
  }

  return ComponentWithRouterProp;
}
