const messages = {
  'resume.experience': `
                { years, plural,
                  =0 {}
                  one {# год и}
                  few {# года и}
                  many {# лет и}
                  other {# лет и}
                }
                { months, plural,
                  =0 {}
                  one {# месяц}
                  few {# месяца}
                  many {# месяцев}
                  other {# месяцев}
                }`,
  'resume.stats-views': `
                { num, plural,
                  =0 {}
                  one {# человек читал его.}
                  few {# человека читали его.}
                  many {# человек читали его.}
                  other {}
                }`,
  'resume.stats-purchases': `
                { num, plural,
                  =0 {}
                  one {# купил доступ к контактам.}
                  few {# купили доступ к контактам.}
                  many {# купили доступ к контактам.}
                  other {}
                }`,
  'resume.job-count': `
                { num, plural,
                  =0 {}
                  one {# место за}
                  few {# места за}
                  many {# места за}
                  other {}
                }`,
};

export default messages;
