const ServiceAndCareTerms = () => {
  return (
    <div className="space-y-4 text-sm">
      <div className="text-sm">
        Normal working hours are defined as 8:30am to 4:30pm Monday through
        Friday inclusive, excluding public holidays, Saturdays and Sundays.
        Elephants Foot Service & Care shall be provided reasonable means of
        access to the equipment being serviced, including supply of access keys,
        swipe cards, access codes, or any other security devices required to
        access the garbage room and/or equipment at the scheduled time.
        Elephants Foot Service & Care shall be permitted to start and stop all
        equipment necessary to perform the herein-agreed services.
      </div>
      <div className="text-sm">
        These terms and conditions are between the parties described in the
        Schedule, together the Parties and each a Party. These terms and
        conditions and the Schedule form the entire agreement under which we
        will provide the Goods and Services to you (together, the Agreement).
      </div>
      <style jsx>
        {`
          li {
            counter-increment: item;
            position: relative;
          }

          /* Reset base styles */
          ol {
            list-style: none;
            margin: 0;
            padding-left: 1.2rem;
          }

          /* --- LEVEL 1: Decimal --- */
          ol.level-1 {
            counter-reset: lvl1;
          }

          ol.level-1 > li {
            counter-increment: lvl1;
            padding-top: 2px;
          }

          ol.level-1 > li::before {
            content: counter(lvl1) ".";
            position: absolute;
            left: -20px;
            width: 1em;
            text-align: left;
            font-weight: bold;
          }

          /* --- LEVEL 2: Decimal with prefix (1.1, 1.2) --- */
          ol.level-2 {
            counter-reset: lvl2;
          }

          ol.level-2 > li {
            counter-increment: lvl2;
            font-style: normal;
            padding-top: 2px;
            padding-left: 10px;
          }

          ol.level-2 > li::before {
            content: counter(lvl1) "." counter(lvl2);
            position: absolute;
            left: -20px;
            text-align: left;
            font-weight: normal;
          }

          /* --- LEVEL 3: Lower alpha (a, b, c) --- */
          ol.level-3 {
            counter-reset: lvl3;
          }

          ol.level-3 > li {
            counter-increment: lvl3;
            font-style: normal;
            padding-top: 2px;
          }

          ol.level-3 > li::before {
            content: "(" counter(lvl3, lower-alpha) ")";
            position: absolute;
            left: -22px;
            width: 1em;
            text-align: left;
            font-weight: 600;
          }
        `}
      </style>
      <div>
        <ol className="space-y-2 level-1">
          <li>
            <strong>ACCEPTANCE</strong>
            <ol className="level-2">
              <li>
                You have requested the Goods and Services set out in the
                Schedule, and accept this Agreement by:
                <ol type="a" className="level-3">
                  <li>signing and returning this Agreement.</li>
                  <li>
                    making any payment of the Price (including any deposit).
                  </li>
                </ol>
              </li>
              <li>
                Please read this Agreement carefully and contact us if you have
                any questions.
              </li>
            </ol>
          </li>

          <li>
            <strong>GOODS AND SERVICES</strong>
            <ol className="level-2">
              <li>
                We agree to provide you the Goods and Services in accordance
                with this Agreement and all relevant laws.
              </li>
              <li>
                You acknowledge and agree that any dates for delivery or for
                completion notified by us are estimates only, and, acting
                reasonably we will have no Liability to you for failing to meet
                any delivery or milestone date.
              </li>
              <li>
                We may provide the Goods and Services to you using our
                Personnel, and they are included in this Agreement.
              </li>
              <li>
                All variations to the Goods and Services must be agreed in
                writing between the Parties and will be priced in accordance
                with any schedule of rates provided by us, or otherwise as
                reasonably determined by us. If we consider that any instruction
                or direction from you constitutes a variation, then we will not
                be obliged to comply with such instruction or direction unless
                agreed in accordance with this clause 2.4.
              </li>
              <li>
                We (Elephants Foot) warrant that we hold all appropriate and
                necessary insurances required for the provision of the Goods and
                Services under this Agreement.
              </li>
            </ol>
          </li>

          <li>
            <strong>PRICE AND PAYMENT</strong>
            <ol className="level-2">
              <li>
                You agree to pay us the Price and all other reasonable expenses
                or disbursements properly incurred by us in the provision of the
                Goods and Services, in accordance with the Payment Terms. All
                amounts are stated in Australian dollars and are exclusive of
                GST (unless otherwise stated).
              </li>
              <li>
                Unless otherwise agreed between the Parties, any deposit in the
                Schedule must be paid before we commence the provision of the
                Goods and Services.
              </li>
              <li>
                If any amounts are unpaid 7 days after the payment date, we may
                suspend the provision of the Goods and Services until we receive
                payment.
              </li>
              <li>
                Subject to the invoice not being in dispute pursuant to Clause
                11.1, If invoices are outside of payment terms and the matter is
                sent for recovery of overdue invoices, the debtor/s shall pay
                for all costs actually incurred by in the recovery of any monies
                owed under this Agreement including recovery agent costs,
                repossession costs and solicitor costs on a solicitor/client
                basis.
              </li>
            </ol>
          </li>
          <li>
            <strong>YOUR OBLIGATIONS AND WARRANTIES</strong>
            <p>You represent, warrant, acknowledge and agree that:</p>
            <ol type="a" className="level-3">
              <li>
                there are no legal restrictions preventing you from engaging us
                or agreeing to this Agreement.
              </li>
              <li>
                you have not relied on any representations or warranties made by
                us in relation to the Goods and Services (including as to
                whether the Goods and Services are or will be fit or suitable
                for your particular purposes), unless expressly stipulated in
                this Agreement.
              </li>
              <li>
                you will cooperate with us, and provide us with all
                documentation, information, instructions, and access necessary
                to enable us to provide the Goods and Services, as requested by
                us, from time to time, and in a timely manner.
              </li>
              <li>
                the information you provide to us is true, correct, and
                complete.
              </li>
              <li>
                you will not infringe any third-party rights in working with us
                and receiving the Goods and Services.
              </li>
              <li>
                you will provide us and our Personnel with sufficient access,
                free from harm or risk to health or safety, to any relevant
                premises (including any facilities at the premises), to enable
                us to provide the Goods and Services, including at the dates and
                times that we may reasonably request; and
              </li>
              <li>
                you are responsible for obtaining, and providing to us if
                necessary, any access, consents, licences, approvals, and
                permissions from other parties necessary for the Goods and
                Services to be provided, at your cost.
              </li>
            </ol>
          </li>

          <li>
            <strong>YOUR STATUTORY RIGHTS</strong>
            <ol className="level-2">
              <li>
                Certain legislation, including the Australian Consumer Law (ACL)
                in the Competition and Consumer Act 2010 and similar consumer
                protection laws and regulations, may confer you with rights,
                warranties, guarantees and remedies relating to the Goods and
                Services which cannot be excluded, restricted or modified
                (Statutory Rights). Nothing in this Agreement excludes your
                Statutory Rights as a consumer under the ACL.
              </li>
              <li>
                You agree that our Liability for the Goods and Services is
                governed solely by the ACL and this Agreement.
              </li>
              <li>
                Subject to your Statutory Rights, we exclude all express and
                implied warranties, representations and guarantees of any kind
                (whether under statute, law, equity or on any other basis) and
                all materials, work, goods and services (including the Goods and
                Services) are provided to you without warranties,
                representations and guarantees of any kind.
              </li>
            </ol>
          </li>
          <li>
            <strong>DELIVERY, TITLE AND RISK</strong>
            <ol className="level-2">
              <li>
                If this Agreement states that:
                <ol type="a" className="level-3">
                  <li>
                    we are responsible for delivering the Goods to you, we will
                    use reasonable endeavours to deliver the Goods to the
                    premises by the delivery time, as notified by us to you; or
                  </li>
                  <li>
                    you are responsible for collecting the Goods from us, we
                    will use reasonable endeavours to make available the Goods,
                    and you agree to collect the Goods, at the collection
                    location by the collection time, as notified by us to you.
                    You agree to comply with any policies and procedures which
                    apply at the relevant collection location.
                  </li>
                </ol>
              </li>
              <li>
                Title in the Goods will remain with us until all amounts due and
                payable to us under this Agreement are paid in full. Risk in the
                Goods will pass to you on delivery of the Goods to you or
                collection of the Goods by you (as applicable).
              </li>
              <li>
                You agree that we hold a general lien over any Goods owned by us
                that are in your possession, for the satisfactory performance of
                your obligations under this Agreement. You agree that this
                Agreement and your obligations under this Agreement create a
                registrable security interest in favour of us, and you consent
                to the security interest (and any other registrable interest
                created in connection with this Agreement) being registered on
                any relevant securities register (and you must do all things to
                enable us to do so).
              </li>
            </ol>
          </li>
          <li>
            <strong>TERM AND TERMINATION</strong>
            <ol className="level-2">
              <li>
                This Agreement will commence on the Start Date, and will
                continue until the End Date, unless terminated earlier in
                accordance with its terms.
              </li>
              <li>
                Either Party may terminate this Agreement if the other Party
                breaches a material term of this Agreement, and that breach has
                not been remedied within 10 business days of being notified by
                the relevant Party.
              </li>
              <li>
                On termination or expiry of this Agreement, you agree that:
                <ol type="a" className="level-3">
                  <li>
                    any amounts paid for Goods and Services rendered by us are
                    non-refundable.
                  </li>
                  <li>
                    you agree to pay us all amounts due and payable to us under
                    this Agreement (including for all Goods and Services
                    provided by us) up to the date of termination, as a debt
                    immediately due and payable; and
                  </li>
                  <li>
                    you agree to return or give us access to recover all
                    property belonging to us on request (including any
                    Intellectual Property or Confidential Information), and to
                    give us or our Personnel such rights of access necessary to
                    exercise our rights under this clause.
                  </li>
                </ol>
              </li>
              <li>
                The accrued rights, obligations and remedies of the Parties are
                not affected by termination of this Agreement.
              </li>
              <li>
                0% of the remaining agreement to be paid by the client if
                agreement is terminated prior to the expiry of the agreement.
              </li>
            </ol>
          </li>
          <li>
            <strong>LIABILITY, INDEMNITY AND EXCLUSIONS</strong>
            <ol className="level-2">
              <li>
                <b>Exclusions:</b> Despite anything to the contrary, to the
                maximum extent permitted by law, we will not be liable for, and
                you waive and release us from and against, any Liability caused
                or contributed to by (whether directly or indirectly):
                <ol type="a" className="level-3">
                  <li>
                    acts or omissions of you or your Personnel (including any
                    works, goods or services provided by you or your Personnel).
                  </li>
                  <li>
                    your, or your Personnel’s, breach of this Agreement, any law
                    or third-party rights
                  </li>
                  <li>
                    any information, documentation, specifications or directions
                    given by you or your Personnel; and
                  </li>
                  <li>
                    any event or circumstance beyond our reasonable control.
                  </li>
                </ol>
              </li>
              <li>
                <b>Indemnity:</b> Despite anything to the contrary, to the
                maximum extent permitted by law, you are liable for, and agree
                to make good, indemnify us and hold us harmless in respect of,
                any Liability that we may suffer, incur or otherwise become
                liable for, arising from or in connection with:
                <ol type="a" className="level-3">
                  <li>acts or omissions of you or your Personnel; or</li>
                  <li>
                    any information, documentation, specifications or directions
                    given by you or your Personnel.
                  </li>
                </ol>
              </li>
              <li>
                <b>Limitation of liability:</b> Despite anything to the
                contrary, to the maximum extent permitted by law:
                <ol type="a" className="level-3">
                  <li>we will not be liable for any Consequential Loss; and</li>
                  <li>
                    our maximum aggregate Liability in relation to the provision
                    of the Goods and Services or this Agreement will be limited
                    to us resupplying the Goods and Services to you or, in our
                    sole discretion, to us repaying you the amount of the Price
                    paid by you to us in respect of the provision of the
                    relevant Goods and Services to which the Liability relates.
                  </li>
                </ol>
              </li>
            </ol>
          </li>
          <li>
            <strong>INTELLECTUAL PROPERTY</strong>
            <ol className="level-2">
              <li>
                As between the Parties, all Intellectual Property Rights
                developed, adapted, modified or created by or on behalf of us or
                our Personnel in connection with this Agreement or the provision
                of the Goods and Services, will at all times vest, or remain
                vested, in us.
              </li>
              <li>
                You agree that we own all Intellectual Property Rights in all
                Intellectual Property owned, licensed or developed by or on
                behalf of us or our Personnel before the Start Date and/or
                developed by us or our Personnel independently of this Agreement
                and nothing in this Agreement constitutes a transfer or
                assignment of any of our Intellectual Property Rights unless
                expressly stated.
              </li>
            </ol>
          </li>
          <li>
            <strong>CONFIDENTIALITY</strong>
            <ol className="level-2">
              <li>
                Subject to clause 10.2, you must (and must ensure that your
                Personnel do) keep confidential, and not use or permit any
                unauthorised use of, all Confidential Information.
              </li>
              <li>
                Clause 10.1 does not apply where the disclosure is required by
                law or the disclosure is to a professional adviser in order to
                obtain advice in relation to matters arising in connection with
                this Agreement and provided that you ensure the adviser complies
                with the terms of clause 10.1.
              </li>
            </ol>
          </li>

          <li>
            <strong>GENERAL</strong>
            <ol className="level-2">
              <li>
                <b>Disputes:</b> A Party may not commence court proceedings
                relating to any dispute, controversy or claim arising from, or
                in connection with, this Agreement (including any question
                regarding its existence, validity or termination) (Dispute)
                without first meeting with a senior representative of the other
                Party to seek (in good faith) to resolve the Dispute. If the
                Parties cannot agree how to resolve the Dispute at that initial
                meeting, either Party may refer the matter to a mediator. If the
                Parties cannot agree on who the mediator should be, either Party
                may ask the law society of the State to appoint a mediator. The
                mediator will decide the time, place and rules for mediation.
                The Parties agree to attend the mediation in good faith, to seek
                to resolve the Dispute. The costs of the mediation will be
                shared equally between the Parties. Nothing in this clause will
                operate to prevent a Party from seeking urgent injunctive or
                equitable relief from a court of appropriate jurisdiction.
              </li>
              <li>
                <b>Governing law:</b> This Agreement is governed by the laws of
                the State. Each Party irrevocably and unconditionally submits to
                the exclusive jurisdiction of the courts operating in the State
                and any courts entitled to hear appeals from those courts and
                waives any right to object to proceedings being brought in those
                courts.
              </li>
              <li>
                <b>GST:</b> If and when applicable, GST payable on the Price
                will be set out in our invoice. You agree to pay the GST amount
                at the same time as you pay the Price.
              </li>
              <li>
                <b>Notices:</b> Any notice given under this Agreement must be in
                writing addressed to the relevant address last notified by the
                recipient to the Parties. Any notice may be sent by standard
                post or email and will be deemed to have been served on the
                expiry of 48 hours in the case of post, or at the time of
                transmission in the case of transmission by email.
              </li>
              <li>
                <b>Severance:</b> If any provision (or part of it) under this
                Agreement is held to be unenforceable or invalid in any
                jurisdiction, then it will be interpreted as narrowly as
                necessary to allow it to be enforceable or valid. If a provision
                (or part of it) under this Agreement cannot be interpreted as
                narrowly as necessary to allow it to be enforceable or valid,
                then the provision (or part of it) must be severed from this
                Agreement and the remaining provisions (and remaining part of
                the provision) of this Agreement is valid and enforceable.
              </li>
              <li>
                <b>Survival:</b> Clauses 3, 5, 6.3, 7.3, 8, 9, 10 and 11 will
                survive the termination or expiry of this Agreement.
              </li>
            </ol>
          </li>

          <li>
            <strong>INTERPRETATION &amp; DEFINITIONS</strong>
            <ol className="level-2">
              <li>
                Any reference to “Goods and Services” may mean “Goods and/or
                Services”, as the case may be.
              </li>
              <li>
                In this Agreement, unless the context otherwise requires,
                capitalised terms have the meanings given to them in the
                Schedule, within these terms and conditions, and:
                <p>
                  <b>Confidential Information</b> includes information which:
                </p>
                <ol className="level-3" type="a">
                  <li>
                    is disclosed to you in connection with this Agreement at any
                    time.
                  </li>
                  <li>
                    is prepared or produced under or in connection with this
                    Agreement at any time.
                  </li>
                  <li>relates to our business, assets or affairs; or</li>
                  <li>
                    relates to the subject matter of, the terms of and/or any
                    transactions contemplated by this Agreement, whether or not
                    such information or documentation is reduced to a tangible
                    form or marked in writing as “confidential”, and howsoever
                    you receive that information.
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      </div>
      <p>
        <b>Consequential Loss</b> includes any consequential, special or
        indirect loss, damage or expense including any real or anticipated loss
        of revenue, loss of profit, loss of use, loss of occupation, loss of
        benefit, loss of financial opportunity, or economic loss whether arising
        out of a breach of this Agreement, at law, under any statute, in equity,
        or in tort (including negligence).
      </p>
      <p>
        <b>Intellectual Property</b> means any copyright, registered or
        unregistered design, patent or trademark rights, domain names, know-how,
        inventions, processes, trade secrets or Confidential Information; or
        circuit layouts, software, computer programs, databases or source codes,
        including any application, or right to apply, for registration of, and
        any improvements, enhancements or modifications of, the foregoing.
      </p>
      <p>
        <b>Intellectual Property Rights</b> means for the duration of the rights
        in any part of the world, any industrial or intellectual property
        rights, whether registrable or not, including in respect of Intellectual
        Property.
      </p>
      <p>
        <b>Liability</b> means any expense, cost, liability, loss, damage,
        claim, notice, entitlement, investigation, demand, proceeding or
        judgment (whether under statute, contract, equity, tort (including
        negligence), indemnity or otherwise), howsoever arising, whether direct
        or indirect and/or whether present, unascertained, future or contingent
        and whether involving a third party, a Party or otherwise.
      </p>
      <p>
        <b>Personnel</b> means, in respect of a Party, any of its employees,
        consultants, suppliers, subcontractors or agents.
      </p>
      <p>
        <b>Schedule</b> means the schedule to which this Agreement is attached.
      </p>
    </div>
  );
};

export default ServiceAndCareTerms;
