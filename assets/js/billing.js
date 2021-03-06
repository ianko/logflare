let hooks = {}

hooks.PaymentMethodForm = {
    init(stripeKey, stripeCustomer, hook) {
        var stripe = Stripe(stripeKey);
        var elements = stripe.elements();

        const style = {
            base: {
                iconColor: '#c4f0ff',
                color: '#fff',
                fontWeight: 500,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': {
                    color: '#fce883',
                },
                '::placeholder': {
                    color: '#87BBFD',
                },
            },
            invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
            }
        };

        var card = elements.create('card', { style: style });

        card.mount('#card-element');

        card.on('change', function (event) {
            displayError(event);
        });

        hook.handleEvent("submit", () => createPaymentMethod(card, stripeCustomer))

        function displayError(event) {
            let displayError = document.getElementById('card-element-errors');
            if (event.error) {
                /*
                hook.pushEventTo("#payment-form", "payment-method-error", {
                    message: event.error.message
                })
                */

                displayError.textContent = event.error.message
            } else {
                /*
                hook.pushEventTo("#payment-form", "clear-flash", {

                })
                */
                displayError.textContent = ''
            }
        };

        function createPaymentMethod(cardElement, customerId) {
            return stripe
                .createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                })
                .then((result) => {
                    if (result.error) {
                        displayError(result);
                    } else {
                        hook.pushEventTo("#payment-form", "save", {
                            brand: result.paymentMethod.card.brand,
                            last_four: result.paymentMethod.card.last4,
                            exp_month: result.paymentMethod.card.exp_month,
                            exp_year: result.paymentMethod.card.exp_year,
                            stripe_id: result.paymentMethod.id,
                            customer_id: customerId
                        })
                    }
                });
        };
    },

    mounted() {
        var el = this.el
        var hook = this
        this.init(el.dataset.stripeKey, el.dataset.stripeCustomer, hook)
        console.log("mounted")

    },

    updated() {
        var el = this.el
        var hook = this
        this.init(el.dataset.stripeKey, el.dataset.stripeCustomer, hook)
        console.log("updated")
    },

    disconnected() {
        console.log("disconnected")
    },

    reconnected() {
        console.log("reconnected")
    },

    destroyed() {
        console.log("destroyed")
    }

}

export default hooks