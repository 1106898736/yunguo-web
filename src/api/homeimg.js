import request from '@/utils/request'

export function listGoods() {
  return request({
    url: '/homeimg/list',
    method: 'get'
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
    url: '/homeimg/update',
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
