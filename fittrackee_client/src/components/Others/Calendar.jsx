// eslint-disable-next-line max-len
// source: https://blog.flowandform.agency/create-a-custom-calendar-in-react-3df1bfd0b728
import dateFns from 'date-fns'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getMonthActivities } from '../../actions/activities'
import { getDateWithTZ } from '../../utils'

const getStartAndEndMonth = date => {
  const monthStart = dateFns.startOfMonth(date)
  const monthEnd = dateFns.endOfMonth(date)
  return {
    start: dateFns.startOfWeek(monthStart),
      end: dateFns.endOfWeek(monthEnd),
  }
}


class Calendar extends React.Component {
  constructor(props, context) {
    super(props, context)
    const calendarDate = new Date()
    this.state = {
      currentMonth: calendarDate,
      startDate: getStartAndEndMonth(calendarDate).start,
      endDate: getStartAndEndMonth(calendarDate).end,
    }
  }

  componentDidMount() {
    this.props.loadMonthActivities(this.state.startDate, this.state.endDate)
  }

  renderHeader() {
    const dateFormat = 'MMM YYYY'
    return (
      <div className="header row flex-middle">
        <div className="col col-start" onClick={() => this.handlePrevMonth()}>
          <i
            className="fa fa-chevron-left"
            aria-hidden="true"
          />
        </div>
        <div className="col col-center">
          <span>
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
        <div className="col col-end" onClick={() => this.handleNextMonth()}>
            <i
              className="fa fa-chevron-right"
              aria-hidden="true"
            />
        </div>
      </div>
    )
  }

  renderDays() {
    const dateFormat = 'ddd'
    const days = []
    const { startDate } = this.state

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )
    }
    return <div className="days row">{days}</div>
  }

  filterActivities(day) {
    const { activities, user } = this.props
    if (activities) {
      return activities
        .filter(act => dateFns.isSameDay(
          getDateWithTZ(act.activity_date, user.timezone),
          day
        ))
    }
    return []
  }

  renderCells() {
    const { currentMonth, startDate, endDate } = this.state
    const { sports } = this.props

    const dateFormat = 'D'
    const rows = []

    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat)
        const dayActivities = this.filterActivities(day)
        const isDisabled = dateFns.isSameMonth(day, currentMonth)
          ? ''
          : 'disabled'
        days.push(
          <div
            className={`col cell img-${isDisabled}`}
            key={day}
          >
            <span className="number">{formattedDate}</span>
            {dayActivities.map(act => (
              <Link key={act.id} to={`/activities/${act.id}`}>
                <img
                  alt="activity sport logo"
                  className={`activity-sport ${isDisabled}`}
                  src={sports
                    .filter(s => s.id === act.sport_id)
                    .map(s => s.img)}
                  title={act.title}
                />
              </Link>
            ))}
          </div>
        )
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      )
      days = []
    }
    return <div className="body">{rows}</div>
  }

  updateStateDate (calendarDate) {
    const { start, end } = getStartAndEndMonth(calendarDate)
    this.setState({
      currentMonth: calendarDate,
      startDate: start,
      endDate: end,
    })
    this.props.loadMonthActivities(start, end)
  }

  handleNextMonth () {
    const calendarDate = dateFns.addMonths(this.state.currentMonth, 1)
    this.updateStateDate(calendarDate)
  }

  handlePrevMonth () {
    const calendarDate = dateFns.subMonths(this.state.currentMonth, 1)
    this.updateStateDate(calendarDate)
  }

  render() {
    return (
      <div className="card activity-card">
        <div className="calendar">
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    activities: state.calendarActivities.data,
    sports: state.sports.data,
    user: state.user,
  }),
  dispatch => ({
    loadMonthActivities: (start, end) => {
      const dateFormat = 'YYYY-MM-DD'
      dispatch(getMonthActivities(
        dateFns.format(start, dateFormat),
        dateFns.format(end, dateFormat),
      ))
    },
  })
)(Calendar)