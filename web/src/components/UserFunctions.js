import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
      console.log('Registered')
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
      if (!response.data.hasOwnProperty('error')){
        localStorage.setItem('usertoken', response.data)
      }
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getProfile = user => {
  return axios
    .post('users/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getHistory = data => {
  return axios
    .post('users/history', {
      email:data.email
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const predict = data => {
  return axios
    .post('users/predict', {
      email: data.email,
      totalGroundArea: data.totalGroundArea,
      lotArea : data.lotArea,
      lotFrontage : data.lotFrontage,
      bedroomNumber : data.bedroomNumber,
      bathroomNumber : data.bathroomNumber
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const clearHist = data => {
  return axios
  .post('users/clearHist', {
    email: data.email
  })
  .then(response => {
    console.log(response)
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}