import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Redirect, Route, Switch } from 'react-router-dom'

import AdminDashboard from './AdminDashboard'
import AdminMenu from './AdminMenu'
import AdminSports from './Sports'
import AccessDenied from './../Others/AccessDenied'
import NotFound from './../Others/NotFound'
import { isLoggedIn } from '../../utils'

function Admin(props) {
  const { t, user } = props
  return (
    <div>
      <Helmet>
        <title>FitTrackee - {t('administration:Administration')}</title>
      </Helmet>
      <div className="container dashboard">
        <div className="row">
          <div className="col-md-3">
            <div className="card activity-card">
              <div className="card-header">
                <Link
                  to={{
                    pathname: '/admin/',
                  }}
                >
                  {t('administration:Administration')}
                </Link>
              </div>
              <div className="card-body">
                <AdminMenu t={t} />
              </div>
            </div>
          </div>
          <div className="col-md-9">
            {isLoggedIn() ? (
              user.admin ? (
                <Switch>
                  <Route
                    exact
                    path="/admin"
                    render={() => <AdminDashboard t={t} />}
                  />
                  <Route
                    exact
                    path="/admin/sports"
                    render={() => <AdminSports t={t} />}
                  />
                  <Route component={NotFound} />
                </Switch>
              ) : (
                <AccessDenied />
              )
            ) : (
              <Redirect to="/login" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(
  connect(state => ({
    user: state.user,
  }))(Admin)
)
