// The keys must be lowercase and with
// three letters max

export default () => {
  return {
    cn: {
      connectedWithNext: true,
    },
    cnd: {
      connectedWithNext: {
        type: 'dashed',
      },
    },
    co: {
      conditional: true,
    },
    nr: {
      inNewRow: true,
    },
    sn: {
      showNumbers: true,
    },
    sna: {
      showNumbersAll: true,
    },
  }
}
