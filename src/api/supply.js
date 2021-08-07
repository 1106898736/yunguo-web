import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/supply/list',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/supply/create',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: '/supply/read',
    method: 'get',
    data
  })
}

export function updateAd(data) {
  return request({
    url: '/supply/update',
    method: 'post',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: '/supply/delete',
    method: 'post',
    data
  })
}
