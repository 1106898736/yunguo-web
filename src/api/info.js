import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/info/list',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/info/delete',
    method: 'post',
    data
  })
}

export function publishInfos(data) {
  return request({
    url: '/info/create',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/info/detail',
    method: 'get',
    params: { id }
  })
}

export function editGoods(data) {
  return request({
    url: '/info/update',
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
