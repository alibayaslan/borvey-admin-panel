import { Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/layout";

import { useSelector, useDispatch } from "react-redux";
import routes from "./routes/index";
import moment from "moment";
import "moment/locale/tr";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import SignIn from "./containers/SignIn/SignIn";

const App = () => {
  moment.locale("tr");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isAuth = localStorage.getItem("token");
  const userInfo = useSelector((state) => state.user);
  const location = window.location.pathname;

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Router>
          <>
            <Routes>
              <Route path="/login" element={<SignIn />} />

              <Route element={<Layout />}>
                {routes.map((route, index) => {
                  const { path, component: Component } = route;
                  return (
                    <Route
                      key={index}
                      path={path}
                      exact={true}
                      element={
                        <Suspense fallback={<div>Yükleniyor...</div>}>
                          <ProtectedRoute>
                            <Component />
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />
                  );
                })}
              </Route>
              {/* <Route path="/*" element={<NotFound />} /> */}
            </Routes>
          </>
        </Router>
      )}
    </>
  );
};

export default App;
