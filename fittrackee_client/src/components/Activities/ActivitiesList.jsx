import { format } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'

export default function ActivitiesList (props) {
  const { activities, sports } = props
  return (
    <div className="card">
      <div className="card-bord">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Workout</th>
              <th scope="col">Date</th>
              <th scope="col">Distance</th>
              <th scope="col">Duration</th>
              <th scope="col">Ave. speed</th>
            </tr>
          </thead>
          <tbody>
            { sports && activities.map((activity, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={idx}>
                <td >
                  <img
                    className="activity-sport"
                    src={sports
                      .filter(s => s.id === activity.sport_id)
                      .map(s => s.img)}
                    alt="activity sport logo"
                  />
                </td>
                <td >
                  <Link to={`/activities/${activity.id}`}>
                    {activity.title}
                  </Link>
                  </td>
                <td >{format(activity.activity_date, 'DD/MM/YYYY HH:mm')}</td>
                <td >{activity.distance} km</td>
                <td >{activity.duration}</td>
                <td >{activity.ave_speed} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
