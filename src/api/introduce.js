import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/introduce/list',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/introduce/delete',
    method: 'post',
    data
  })
}

export function publishGoods(data) {
  return request({
    url: '/introduce/create',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/introduce/detail',
    method: 'get',
    params: { id }
  })
}

export function editGoods(data) {
  return request({
    url: '/introduce/update',
    method: 'post',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/introduce/catAndBrand',
    method: 'get'
  })
}
